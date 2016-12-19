# 1web-puzzler

## Synopsis

This project was done for the SUPINFO 1WEB mini-project where we were asked to
make a little puzzle game using the vanilla HTML, CSS and JavaScript only
(jQuery was also permitted, but not used here).

## Notes

### The CSS

The CSS style used here is strongly inspired from the philosophy of functional
CSS and Tachyons CSS library's works. It was something I wanted to try out, as
it seems that it was gaining popularity for some time now.

### dragndrop.js

In this file a little set of functions I wrote that can be revised to build a
very minimalistic drag and drop library. All the functionalities I wanted to
implement didn't make it but the idea is here. An example of the things I didn't
have time to add is the `drop-anchor--swap-elements` class that swap two
elements when a draggable want to tie to an already full drop anchor.

### `(...) => {...}` ? `[...Array]` ?? `let`/`const` ???

Some _experimental_ js features presented in the last ECMAScript specifications
were used. I didn't have time to downgrade all the syntax to es5. I point it as
this is js syntax we didn't see in class.

### Coding style

I used the [semistandard][sms] coding style for the JavaScript.

### Git

Git was used for this project, and is hosted on GitHub at
https://github.com/pldiiw/1web-puzzler
.

## LICENSE

This repo is under the Unlicense. See LICENSE file for more information.  
EXCEPT the version tagged v1.0.0 that is licensed to SUPINFO International
University under the FreeBSD license. See [here][freebsd] for more insight.

[freebsd]: https://en.wikipedia.org/wiki/BSD_licenses#2-clause
[sms]: https://github.com/Flet/semistandard
