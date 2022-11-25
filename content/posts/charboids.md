---
title: "character boids"
date: 2022-11-14T11:24:24-05:00
draft: true 
---

## what are boids?

Boids are bird-like 

## implementing 

Three core behaviors guide the boids' movements: seperation,
alignment, and cohesion.

### seperation
```typescript
seperate(b: BoidBody, j: number): Vector {
    // boids avoid nearby boids
    let c: Vector = [0, 0];
    let desiredSeperation = 50;

    let [bx, by] = b.p;
    let count = 0;
    for (let i = 0; i < this.bodies.length; i++) {
      let [x, y] = this.bodies[i].p;
      if (x === bx && y === by) continue;

      let d = this.getDistance(j, i);
      if (d > 0 && d < desiredSeperation) {
        let diff = vec_sub(b.p, this.bodies[i].p);
        let ndiff = normalize(diff);
        let scaled = vec_scale(ndiff, 1 / d);

        c = vec_add(c, scaled);
        count += 1;
      }
    }

    if (count > 0) {
      c = vec_scale(c, 1 / count);
    }

    c = vec_scale(normalize(c), MAX_SPEED);
    c = vec_sub(c, b.v);

    return [
      clamp(c[0], -MAX_FORCE, MAX_FORCE),
      clamp(c[1], -MAX_FORCE, MAX_FORCE),
    ];
  }
```

### alignment 
```

```

### cohesion

With these there simple rules boids emulate the movement of a
flock of birds. We can take this a step farther, and add more
complexity to their movement, by expanding each boids environmental
awareness.

## extending
Now, we can go ahead and add a few more rules to guide the boids'
movement

## applying to individual characters 
Now that we've got the boid simulation squared away, let's move away
from the canvas and turn a paragraph into a swarm of character
boids.  

The complete source code can be found []().

## future work

