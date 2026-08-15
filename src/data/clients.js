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
 * `small` means the source file is too low-resolution to render at full size.
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
    small: true,
  },
  {
    id: 'ue',
    name: 'Urban Ethnographers',
    logo: '/logos/client-ue.webp',
    ground: '#f8c808',
    accent: '248, 200, 8',
  },
]

export const getClient = (id) => clients.find((c) => c.id === id)
