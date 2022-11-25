---
title: "asteroids as a process manager"
date: 2022-11-01T10:09:49-04:00
draft: true 
---

## background 

A while ago I came across
[ps-doom](https://www.cs.unm.edu/~dlchao/flake/doom/chi/chi.html), a fun project
transforms the classic game of DOOM into an interface for process
control. Each monster that is spawned corresponds to a running process; killing
the monster will kill the process. `kill <pid>` has become a bloody monster
execution... PROC-AST implements the same idea - using a game as an alternative
interface for process management - but using the class arcade game Asteroids.

## coding PROC-AST

I chose the [piston](https://www.piston.rs/) game engine as I had seen
it recommended on r/rust and it had a fair bit of documentation and
examples for getting started. 


## running PROC-AST

If you want to play PROC-AST yourself I'd recommend starting up a
virtual machine... Follow the directions below to build and run the application. 

### building & running

```shell {}
# some code
echo "Hello World"
$ git clone https://github.com/smbddha/procast.git  

$ cargo run
```

A prebuilt binary for Ubuntu/Linux Mint can be found on the project's [github]().

## future plans

This implementation if fairly barebones, but I have plans to add basic
animations, scores, alien spaceship enemies, and eventually parametric
asteroids whose size, speed, and shape would be influenced by the
corresponding process's RAM, CPU, and I/O usage.
