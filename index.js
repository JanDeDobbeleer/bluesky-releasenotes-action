const core = require('@actions/core');
const github = require('@actions/github');
const { BskyAgent } = require('@atproto/api');

async function run() {
  try {
    const title = core.getInput('title', { required: true });
    const blueskyIdentifier = core.getInput('bluesky-identifier', { required: true });
    const blueskyPassword = core.getInput('bluesky-password', { required: true });
    const token = core.getInput('github-token', { required: true });
    core.setSecret(token);
    core.setSecret(blueskyPassword);

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    const response = await octokit.rest.repos.getLatestRelease({
      owner: owner,
      repo: repo
    });

    const release = response.data;

    let notes = release.body;

    // replace all non-supported characters
    notes = notes.replaceAll('### ', '');
    notes = notes.replaceAll('**', '');
    notes = notes.replace(/ \(\[[0-9a-z]+\]\(.*\)/g, '');
    notes = notes.trim();
    notes = notes.substring(0, 249);

    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: blueskyIdentifier, password: blueskyPassword });

    const version = release.name;

    const text = `📦 ${version}

${notes}

#${repo} #oss #cli #opensource`;

    console.log(`Posting to Bluesky:\n\n${text}`);

    await agent.post({
      text: text,
      embed: {
        $type: 'app.bsky.embed.external',
        external: {
          uri: `https://github.com/${owner}/${repo}/releases/tag/${version}`,
          title: title,
          description: version,
        },
      },
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
