// Script to create consolidated PR comments with test results
// Usage: Called from GitHub Actions workflow

module.exports = async ({ github, context, fs }) => {
	const runId = context.runId;
	const repo = context.repo;
	const artifactUrl = `https://github.com/${repo.owner}/${repo.repo}/actions/runs/${runId}`;

	// Read test results
	let testResults = '';
	try {
		const results = JSON.parse(fs.readFileSync('playwright-report/results.json', 'utf8'));
		const stats = results.stats;
		const passed = stats.expected || 0;
		const failed = stats.unexpected || 0;
		const flaky = stats.flaky || 0;
		const skipped = stats.skipped || 0;
		const total = passed + failed + flaky + skipped;

		const testEmoji = failed > 0 ? '❌' : flaky > 0 ? '⚠️' : '✅';
		testResults = `${testEmoji} **${passed}/${total} passed** ${failed > 0 ? `| ${failed} failed` : ''} ${flaky > 0 ? `| ${flaky} flaky` : ''}`;
	} catch (e) {
		testResults = '⚠️ Test results unavailable';
	}

	// Get lint/typecheck status
	const { data: workflows } = await github.rest.actions.listWorkflowRunsForRepo({
		owner: repo.owner,
		repo: repo.repo,
		event: 'pull_request',
		per_page: 10
	});

	const lintRun = workflows.workflow_runs.find(
		(run) =>
			run.head_sha === context.payload.pull_request.head.sha &&
			run.name === 'Lint and TypeScript Check'
	);

	const lintStatus =
		lintRun?.conclusion === 'success'
			? '✅ Passed'
			: lintRun?.conclusion === 'failure'
				? '❌ Failed'
				: lintRun?.status === 'in_progress' || lintRun?.status === 'queued'
					? '⏳ Running...'
					: '⚠️ Pending';

	const hasFailures = failed > 0 || lintRun?.conclusion === 'failure';

	const comment = `## 🔍 CI Results

<table>
  <thead>
    <tr>
      <th align="left">Check</th>
      <th align="left">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🧪 Playwright Tests</td>
      <td>${testResults}</td>
    </tr>
    <tr>
      <td>🔧 Lint & TypeScript</td>
      <td>${lintStatus}</td>
    </tr>
  </tbody>
</table>

${hasFailures ? '\n> [!WARNING]\n> **Action Required:** Please fix the failing checks before merging.\n' : '\n> [!NOTE]\n> All checks passed! ✨\n'}

<details>
<summary>📊 View Test Artifacts & Reports</summary>

<br>

**Available Downloads:**
- 📄 [Full HTML Report](${artifactUrl}#artifacts) - Download \`playwright-report-merged\` artifact
- 📸 [Screenshots & Videos](${artifactUrl}#artifacts) - Download \`playwright-screenshots-*\` artifacts

**How to view:**
1. Download the \`playwright-report-merged\` artifact from the link above
2. Extract the archive
3. Open \`index.html\` in your browser
4. Click on any test to see screenshots, diffs, and execution traces

</details>
  `;

	// Find and update existing comment or create new one
	const { data: comments } = await github.rest.issues.listComments({
		issue_number: context.issue.number,
		owner: repo.owner,
		repo: repo.repo
	});

	const botComment = comments.find(
		(comment) => comment.user.type === 'Bot' && comment.body.includes('🔍 CI Results')
	);

	if (botComment) {
		await github.rest.issues.updateComment({
			owner: repo.owner,
			repo: repo.repo,
			comment_id: botComment.id,
			body: comment
		});
	} else {
		await github.rest.issues.createComment({
			issue_number: context.issue.number,
			owner: repo.owner,
			repo: repo.repo,
			body: comment
		});
	}
};
