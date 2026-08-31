/* Open roles.
 *
 * One entry per position. `open: false` keeps a role on the page but closes
 * applications, which is kinder than deleting it the moment a hire is made.
 * Everything here is public copy, so it should read the way the rest of the
 * site does: concrete about the work, honest about the limits.
 */
export const roles = [
  {
    slug: 'application-development-intern',
    title: 'Application Development Intern',
    open: true,
    type: 'Internship',
    length: '6 months',
    location: 'Bengaluru, or remote within India',
    team: 'Engineering',
    summary:
      'Build real product with React Native, React and Node against a SQL database. You will ship to something people actually use, not a sandbox project that gets deleted at the end.',
    about:
      'We are a small team, so an intern here is not fetching coffee or writing throwaway prototypes. You will pick up tickets from the same board as everyone else, your pull requests go through the same review, and what you build gets deployed. The trade is that we expect you to be hands-on from week one rather than learning the basics on our time.',
    need: [
      ['React Native', 'You have built and run a mobile app yourself, on a real device, not only in a simulator.'],
      ['React', 'Comfortable with hooks, state and component structure. You know why a re-render happened.'],
      ['Node.js', 'You have written an API, handled errors properly, and know what to do when a request hangs.'],
      ['SQL', 'You can model a few related tables, write joins, and explain why an index matters.'],
      ['Git', 'Branches, pull requests and the ability to read a diff before you push it.'],
    ],
    doing: [
      'Ship features across a React Native app and a React web front end.',
      'Write and maintain Node services and the SQL schemas behind them.',
      'Fix real bugs reported by real users, including the boring ones.',
      'Write the tests that stop your fix regressing next month.',
      'Sit in review, both receiving it and giving it.',
    ],
    nice: [
      'Anything you have shipped and can show us, at any scale.',
      'Exposure to TypeScript, Expo, or a hosted database.',
      'A working understanding of what an LLM API call actually costs.',
    ],
    honest:
      'This is a paid internship with a view to a full-time offer, but the offer is not automatic and we will not pretend otherwise. We will tell you where you stand at the halfway point rather than at the end.',
  },
]

export const getRole = (slug) => roles.find((r) => r.slug === slug)
export const openRoles = () => roles.filter((r) => r.open)
