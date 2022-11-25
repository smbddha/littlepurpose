---
title: "character boids"
date: 2022-11-14T11:24:24-05:00
draft: true 
---

## what are boids?
Boids are an artificial life simulation that exhibit movements and
behaviors like that of a flock of birds. The emergent behavior of
these boid swarms is complex, but the logic guiding each boid's
movement is relatively simple and based on a few basic rules.

A boids core logic consists of three rules: seperation, coherence, and
alignment. Seperation: a boids will adjust itself to avoid collision
with its boid neighbors. Coherence: boids want to match the speed
of its neighbors. Alignment: boids want to match the direction of
its neighbors. 

With these three rules bird-like movement emerges. Further rules such
as mouse avoidance, or attraction, predators, and wall avoidance can
be added to increase the complexity of the swarms movements.

## character swarm 
Now that we've got the boid simulation squared away, let's move away
from the canvas and turn a paragraph into a swarm of character
boids.  

The complete source code can be found [here](https://github.com/smbddha/charboids).

## the end 

