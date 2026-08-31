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

/* What it is like to work here.
 *
 * Three claims, each one falsifiable. That is the test for anything on this
 * page: if a candidate could arrive and find it untrue, it should not be here.
 * Vague warmth ("we value curiosity") costs nothing to write and tells nobody
 * anything, and the people worth hiring can spot it. */
export const expectations = [
  [
    'You ship in the first week',
    'Not a tutorial branch or a sandbox repo. A real pull request against the board everyone else works from. It might be a small change. It will be in front of users.',
  ],
  [
    'Review is honest',
    'Your code gets read properly, and you will be told why something is wrong rather than only that it is. That is uncomfortable in the first month. It is also the whole reason an internship here is worth more than a certificate.',
  ],
  [
    'You will know where you stand',
    'We say it at the halfway point, not on the last day. If a full-time offer is not coming, you will hear that while there is still time to line something else up.',
  ],
]

/* How hiring runs.
 *
 * ONLY THE FIRST STAGE IS BACKED BY ANYTHING IN THE CODE: the form on this page
 * takes a name, a phone number and a CV, and emails them to the team. Stages two
 * to four are a sensible draft and nobody has confirmed them. Publishing a
 * process you do not follow is worse than publishing none, because a candidate
 * will hold you to it. Confirm or rewrite these before launch. */
export const hiring = [
  [
    'Apply',
    'Name, phone number and your CV. Nothing else, no account to create, no cover letter to pad out.',
  ],
  [
    'We read it',
    'A person reads every application, and it is one of the people you would actually be working with rather than a recruiter filtering on keywords.',
  ],
  [
    'A conversation',
    'A call about what you have built and how you went about it. Bring something you are proud of, at any scale. We would rather hear you explain a small thing well than list a large one vaguely.',
  ],
  [
    'A decision',
    'You get an answer either way, and a reason with it. Being turned down without knowing why helps nobody.',
  ],
]
