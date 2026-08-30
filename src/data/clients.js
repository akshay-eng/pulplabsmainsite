/* Clients whose marks we are permitted to show.
 *
 * Single source of truth — the "Trusted by" row and the testimonial carousel
 * both read from here, so a logo, a ground colour or a permission change lands
 * in one place rather than two.
 *
 * `ground` is the logo file's own background. Every plate that holds one is
 * painted the same colour so the two read as a single shape: the marks are
 * shown unmodified, never knocked out or recoloured, because a trademark
 * recoloured to fit a palette stops being the trademark.
 *
 * `shape` sizes the mark against the others. These lockups range from 1.6:1
 * to 10:1, so matching them on height alone makes the square one tiny and the
 * long one enormous — each is sized so they carry roughly equal weight:
 *   wide    the default, a normal horizontal lockup
 *   xwide   very long and thin, held shorter so it does not dominate a row
 *   blocky  close to square, given more height so it is not a stamp
 *   small   low-resolution source, held down because scaling it only blurs it
 *
 * `accent` is sampled from the artwork, not guessed.
 */
export const clients = [
  {
    id: 'pps',
    name: 'Power & Pack Solutions',
    logo: '/logos/client-pps.webp',
    ground: '#f8f8f8',
    accent: '222, 0, 13',
    // 143x39 after trimming — scaled up it is only a bigger blur.
    shape: 'small',
  },
  {
    id: 'moveforward',
    name: 'moveForward_',
    logo: '/logos/client-moveforward.webp',
    // Its own navy ground. The accent is the orange mark, not the ground —
    // navy on an AMOLED page would be invisible.
    ground: '#083868',
    accent: '240, 144, 80',
    shape: 'blocky', // 200x123, close to square
  },
  {
    id: 'bluesea',
    name: 'Blue Sea Powertech',
    logo: '/logos/client-bluesea.webp',
    ground: '#f8f8f8',
    accent: '0, 116, 217',
    shape: 'xwide', // 667x66, ten to one
  },
  {
    id: 'ue',
    name: 'Urban Ethnographers',
    logo: '/logos/client-ue.webp',
    ground: '#f8c808',
    accent: '248, 200, 8',
  },

  /* Belt only — these appear in the Trusted by marquee but not in the
     testimonial carousel, which picks its four by id. Each keeps its own
     ground colour so the plate behind it matches the file and no mark is
     knocked out or recoloured. */
  {
    id: 'gazet',
    name: 'Gazet International',
    logo: '/logos/client-gazet.webp',
    ground: '#f8f8f8',
    shape: 'wide',
  },
  {
    id: 'intlbm',
    name: 'International Business Magazine',
    logo: '/logos/client-intlbm.webp',
    ground: '#f8f8f8',
    shape: 'wide',
  },
  {
    id: 'sld',
    name: 'SLD',
    logo: '/logos/client-sld.webp',
    ground: '#f8f8f8',
    shape: 'blocky', // square lockup
  },
  {
    id: 'shrusti',
    name: 'Shrusti Agarbatti',
    logo: '/logos/client-shrusti.webp',
    ground: '#f8f8f8',
    shape: 'blocky', // close to square
  },
  {
    id: 'soulcirkus',
    name: 'Soul Cirkus',
    logo: '/logos/client-soulcirkus.webp',
    // Drawn light on its own near-black, unlike every other mark here.
    ground: '#1f2029',
    shape: 'wide',
  },
  {
    id: 'canvape',
    name: 'Canvape',
    logo: '/logos/client-canvape.webp',
    ground: '#f8f8f8',
    shape: 'wide',
  },
]

export const getClient = (id) => clients.find((c) => c.id === id)
