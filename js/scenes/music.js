/* Muziekhoek: zes vormen met tonen die altijd samen klinken, plus trommel en belletje */

const PADS = [
  { kind: 'circle', color: '#f28b82' },
  { kind: 'square', color: '#ffd66b' },
  { kind: 'triangle', color: '#8fcf7c' },
  { kind: 'star', color: '#8fcbea' },
  { kind: 'heart', color: '#f7a8c4' },
  { kind: 'flower', color: '#cdb4f0' }
];

export default {
  id: 'music',
  mount(root, ctx) {
    root.innerHTML = `
      <div class="bg">${ctx.art.landscape()}</div>
      <div class="music-grid" style="position:relative;z-index:1">
        ${PADS.map((p, i) => `<div class="music-pad" data-i="${i}">${ctx.art.shape(p.kind, p.color)}</div>`).join('')}
      </div>
      <div class="music-extra" style="position:relative;z-index:1">
        <div class="music-pad" id="pad-drum">${ctx.art.drum()}</div>
        <div class="music-pad" id="pad-bell">${ctx.art.bell()}</div>
      </div>`;

    root.querySelectorAll('.music-pad[data-i]').forEach((el) => {
      const i = Number(el.dataset.i);
      ctx.onTap(el, () => {
        ctx.audio.note(ctx.audio.SCALE[i], 0.7);
        ctx.animate(el, i % 2 ? 'anim-wiggle' : 'anim-pop');
      });
    });
    ctx.onTap(root.querySelector('#pad-drum'), (e) => { ctx.audio.drum(); ctx.animate(e.currentTarget, 'anim-pop'); });
    ctx.onTap(root.querySelector('#pad-bell'), (e) => { ctx.audio.bell(); ctx.animate(e.currentTarget, 'anim-wiggle'); });

    ctx.setHint('Tik op de vormen en luister');
  }
};
