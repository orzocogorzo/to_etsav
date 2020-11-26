const BaseView = require("../../core/BaseView.js");


const Patrocinadors = (function () {

    /// PRIVATE BLOCK CODE
    var renderCount = 0;
    /// END OF PRIVATE BLOCK CODE

    var Patrocinadors = function (el, template) {
        const self = this;
        this.load(_env.apiURL + "sponsors_images.json")
            .then(function (response) {
                self.data = JSON.parse(response);
            });
    };

    Patrocinadors = BaseView.extend(Patrocinadors);

    Patrocinadors.prototype.onUpdate = function onUpdate () {
        console.log("Patrocinadors updated");
        this.render();
    };

    Patrocinadors.prototype.onRender = function onRender () {
        const self = this;
        for (let img of self.el.querySelectorAll(".logo-container")) {
            img.addEventListener("click", self.onClickImage);
        }
        console.log("Equip rendered");
    };

    Patrocinadors.prototype.beforeRemove = function beforeRemove () {
        for (let img of this.el.querySelectorAll(".logo-container")) {
            img.removeEventListener("click", self.onClickImage);
        }
        console.log("Equip removed");
    };

    Patrocinadors.prototype.onClickImage = function (ev) {
        console.log("Has clicat sobre una imàtge!");
        const carouselImages = document.querySelector('');
    };

    return Patrocinadors;
})();

module.exports = Patrocinadors;
