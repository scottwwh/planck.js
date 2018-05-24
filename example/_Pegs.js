/*
 * Copyright (c) 2016-2018 Ali Shakiba http://shakiba.me/planck.js
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

Math.polar = function(radius, angle) {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
}

// Copied from 'Boxes'
planck.testbed('Pegs', function(testbed) {
  console.log(testbed);
  var pl = planck, Vec2 = pl.Vec2;

  // No gravity
  var world = pl.World(Vec2(0, 0));

  // Mouse handler
  const canvas = document.querySelector('canvas');
  canvas.addEventListener('mouseup', applyImpulse);
  function applyImpulse(e) {
    // console.log(testbed.width, testbed.height);
    const SCALE = 10;
    const sourcePos = Vec2(
      ( e.offsetX - canvas.width * 0.5 ) / SCALE,
      ( e.offsetY - canvas.height * 0.5 ) / -SCALE
    );
    // console.log(sourcePos);

    // Verify position
    // const body = world.createBody().setDynamic();
    // body.createFixture(pl.Circle(1, 1), bouncerFixDef);
    // body.setPosition(sourcePos);
  
    // console.log(bouncers.length);    
    bouncers.forEach(el => {
      const pos = el.getPosition();
      // console.log(pos);
      const blar = Vec2();
      for (const k in pos) {
        blar[k] = pos[k] - sourcePos[k]
      }
      // console.log(blar);
      const rad = Math.atan2(blar.y, blar.x);
      // console.log('angle:', Math.atan2(blar.y, blar.x));
      const force = 15;
      const impulse = Math.polar(force, rad);
      // console.log(force, impulse);
      // console.log(el.isAwake());
      if (el.isAwake()) {
        el.applyLinearImpulse( Vec2(impulse.x, impulse.y), sourcePos );
      } else {
        el.setLinearVelocity( Vec2(impulse.x, impulse.y) );
      }
    });
  }

  // DOES NOTHING
  world.on('joint-removed', e => {
    // console.log(e);
  });

  // THIS WORKS
  world.on('begin-contact', e => {
    // console.log(e);
  })

  function generateRadialCoordinates(segments, radius) {
    const arr = [];
    const angle = Math.PI * 2 / segments;
    for (let i = 0; i < segments; i++) {
      const pos = Math.polar(radius, angle * i);
      arr.push(new Vec2(pos.x, pos.y));
    }
    return arr;
  }

  const pegFixDef = {
    friction: 0.1,
    restitution: 1 // ,
    // userData: 'rail'    
  }
  const pegs = generateRadialCoordinates(7, 12);
  pegs.forEach(vec2 => {
    const peg = world.createBody();
    peg.createFixture(pl.Circle(2, 2), pegFixDef);
    peg.setPosition(vec2);
  });

  
  const segments = 36;
  const radius = 20;
  const angle = Math.PI * 2 / segments;
  const fixDef = {
    friction: 0.1,
    restitution: 1 // ,
    // userData: 'rail'    
  };
  for (let i = 0; i < segments; i = i + 2) {
    var bar = world.createBody();
    const a = Math.polar(radius, angle * i);
    const b = Math.polar(radius, angle * (i + 1));
    bar.createFixture(pl.Edge(Vec2(a.x, a.y), Vec2(b.x, b.y)), fixDef);
  }


  const bouncerFixDef = {
    friction: 0.1,
    restitution: 1 // ,
    // userData: 'rail'    
  }
  const bouncerVecs = generateRadialCoordinates(11, 6);
  const bouncers = [];
  bouncerVecs.forEach(vec2 => {
    const body = world.createBody().setDynamic();
    body.createFixture(pl.Circle(1, 1), bouncerFixDef);
    body.setPosition(vec2);
    body.setMassData({
      mass : 1,
      center : Vec2(),
      I : 1
    });
    // const impulse = new Vec2(10, 10);
    // body.applyLinearImpulse( impulse, body.getPosition() );
    bouncers.push(body);
  });

  return world;
});