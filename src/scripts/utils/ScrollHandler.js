// SOURCE
const Dispatcher = require("../core/Dispatcher.js");


const ScrollHandler = (function() {
    // PRIVATE CODE BLOCK
    var dropWindow = function () {};
    function addWindow (el, callback) {
        document.body.style.overflow = "hidden";
        const onWheel = (function (delta) {
            var lastTrigger = Date.now();
            return function() {
                if (event.type == "keydown") {
                    if (event.keyCode != 40 && event.keyCode != 38) return;
                    event.deltaY = event.keyCode === 38 ? -1 : 1;
                }
                if (Date.now() - lastTrigger >= delta) {
                    callback.apply(null, arguments);
                    lastTrigger = Date.now();
                }
            };
        })(500);
        window.addEventListener("DOMMouseScroll", onWheel);
        window.addEventListener("touchmove", onWheel);
        window.addEventListener("keydown", onWheel);
        window.addEventListener("wheel", onWheel);
        window.addEventListener("mousewheel", onWheel);

        dropWindow = function () {
            window.removeEventListener("DOMMouseScroll", onWheel);
            window.removeEventListener("touchmove", onWheel);
            window.removeEventListener("keydown", onWheel);
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("mousewheel", onWheel);
        };
    }

    // PUBLIC OBJECT
    const ScrollHandler = function(app) {
        const self = this;
        new Dispatcher(this);
        this.app = app;
        this.el = this.app.el;
        this.sections = new Array();
        this.onWheel = this.onWheel.bind(this);

        var currentSection = 0;
        Object.defineProperty(this, "currentSection", {
            set: function (val) {
                currentSection = Math.max(0, Math.min(this.sections.length - 1, val));
                self.dispatch("update:section", currentSection);
            },
            get: function () {
                return currentSection;
            }
        });

        this.scrolling = false;
        window.addEventListener("scroll", (function () {
            var lastTrigger = Date.now();
            var delayed;
            return function () {
                if (Date.now() - lastTrigger < 200) return;
                if (!self.scrolling) {
                    clearTimeout(delayed);
                    delayed = setTimeout(function () {
                        self.onScroll();
                    }, 300);
                }
                lastTrigger = Date.now();
            };
        })());
    };

    ScrollHandler.prototype.patch = function () {
        this.sections = Array.apply(null, document.getElementsByClassName("scroll-section"));
        addWindow(this.el, this.onWheel);
        this.onScroll();
    };

    ScrollHandler.prototype.unpatch = function unpatch () {
        this.sections = new Array();
        dropWindow();
    };

    ScrollHandler.prototype.onWheel = function onWheel (ev) {
        const self = this;
        this.currentSection += (ev.deltaY < 0 ? -1 : 1);
        this.scrolling = true;
        window.scrollTo({
            top: this.sections[this.currentSection].offsetTop,
            behavior: "smooth"
        });
        setTimeout(function () {
            self.scrolling = false;
            self.app.router.silent(self.app.router.generate("home-section", {
                section: self.sections[self.currentSection].id
            }));
        }, 600);
    };

    ScrollHandler.prototype.onScroll = function onScroll () {
        var bounding, fit, currentSection;
        this.sections.reduce(function (acum, section, i) {
            bounding = section.getBoundingClientRect();
            fit = Math.abs(bounding.top) + Math.abs(window.innerHeight - bounding.bottom);
            if (acum > fit) {
                currentSection = i;
                return fit;
            }
            return acum;
        }, Infinity);
        this.currentSection = currentSection;
    };

    return ScrollHandler;
})();

module.exports = ScrollHandler;