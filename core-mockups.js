/* One shared artwork set for every Core Collection selector and thumbnail. */
window.__IMG = Object.fromEntries(['hoodie', 'pants', 'tee', 'jersey', 'cap'].map(function (name) {
  return [name, 'img/core-' + name + '-v1.png'];
}));
window.__SM = window.__IMG;
window.TDMockupAlt = {
  hoodie: 'Cream pullover hoodie with navy sketch outlines and orange stitching',
  pants: 'Cream cuffed track pants with navy sketch outlines and orange stitching',
  tee: 'Cream crewneck tee with navy sketch outlines and orange stitching',
  jersey: 'Cream performance jersey with mesh side panels and orange stitching',
  cap: 'Cream six-panel cap with navy sketch outlines and orange stitching'
};
