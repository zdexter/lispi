lispi
=====

An in-browser Lisp interpreter (for a subset of Scheme)

## Demo

http://polar-shore-4611.herokuapp.com


## Usage

    bundle install
    rackup

### Controls

Up and down for history

Enter to interpret

## Examples (more coming soon)

(+ 2 3) => 5

(+ 2 (* 5 6)) => 32

(+ (+ 2 (+ 1 2)) (* (+ 1 2) (+ 1 2))) => (+ 5 9) => 14

(set! somevar 5) => somevar is 5
