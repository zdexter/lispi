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

#### Arithmetic

(+ 2 3) => 5

(+ 2 (* 5 6)) => 32

(+ (+ 2 (+ 1 2)) (* (+ 1 2) (+ 1 2))) => (+ 5 9) => 14

#### Variables

(set! somevar 5) => true (success)

(defined somevar) => somevar is 5 => true

(4 (lambda n (+ n 3))) => 7

#### Named and anonymous functions

(define myfunc (lambda n (* n 4))) => true

(myfunc 5) => 20
