/*!
* Draggable Navigation Plugin
* Description: Use the draggable handle to show/hide content
*
* Includes jQuery & jQuery UI
* http://jquery.com/
*
* Copyright 2013 Jonathan Sooter
* Released under the MIT license
* https://github.com/jonnysooter/Draggable-Navigation/blob/master/MIT-LICENSE.txt
*
* Date: 2013-2-4
*/

;(function ($) {

    var Slider = {

        init: function (config) {
            //Set up elements with variables
            this.sliderContent = config.sliderContent;
            this.sectionsWrap = config.sectionsWrap;

            //Selects <a>
            this.sectionsLinks = this.sectionsWrap.children().children();

            this.createHandle();
            this.bindEvents();
            this.showFirst();
        },

        createHandle: function() {
            //Create draggable handle
            //If user doesn't have JS, defaults to scrolling, i.e. no drag handle showing.
            this.sectionsWrap.parent().append(
                $(document.createElement("div"))
                    .addClass("handle-containment")
                    .append($(document.createElement("a")).addClass("handle ui-corner-all").text("DRAG"))
            );

            //Select handle
            this.sliderHandle = $(".handle");
            
            // How many sections do we have, and what is the total width of the navbar
            var sectionCount = this.sectionsLinks.length,
                handleWidth = this.sliderHandle.width(),
                totalWidth = sectionCount * handleWidth;

            // We need to explicitly set the container width so that all positioning works
            this.sliderHandle.parent().add(this.sectionsWrap).attr({ style: "width: "+totalWidth+"px;" });
            // Set the sections to the width of the handle for alginment
            this.sectionsWrap.children().css("width", handleWidth);
        },

        bindEvents: function () {
            this.sectionsLinks.on("click", this.wasClicked);
            this.sliderHandle.on("mousedown", this.dragLightUp);
            this.sliderHandle.on("mouseup", this.dragLightOff);
        },

        showFirst: function () {
            this.sliderContent.children().hide();
            this.sliderContent.children(':first').show();
            this.sectionsWrap.children(':first').addClass('on');

            this.setUpDrag();
        },

        setUpDrag: function () {
            this.sliderHandle.draggable({
                axis: "x",
                containment: "parent",
                stop: function (event, ui) {
                    var left = ui.position.left,
                        self = Slider,
                        position = 1,
                        num_sections = self.sectionsLinks.length,
                        section_width = Math.floor(self.sectionsWrap.width() / num_sections);

                    left = Math.round(left / section_width);
                    position = (left * section_width);

                    if (position < section_width) {
                        position = 0.1;
                        left = 0;
                    }

                    if (position) {
                        $(this).animate({
                            left: position
                        }, 200);
                        left = left += 1;
                        Slider.contentTransitions(left);
                    }
                    
                }
            });
        },

        wasClicked: function (e) {
            var self = Slider, //Is callback of click event
                index = self.sectionsLinks.index(this),
                num_sections = self.sectionsLinks.length,
                section_width = Math.floor(self.sectionsWrap.width() / num_sections),
                position = index * section_width;

            if (position < section_width) {
                position = 0.1;
            };

            if (position) {
                $(self.sliderHandle).animate({
                    left: position
                }, 400);
                var left = index += 1
                self.contentTransitions(left);
            }

            e.preventDefault;
        },

        dragLightUp: function () {
            //Is callback of click event
            Slider.sectionsWrap.children().addClass('on divisions');
            Slider.sectionsWrap.children(':first-child').removeClass('divisions');
        },

        dragLightOff: function () {
            //Is callback of click event
            Slider.sectionsWrap.children().removeAttr("class");
        },

        contentTransitions: function (left) {
            this.sliderContent.children().fadeOut(300, 'linear');
            this.sliderContent.children(':nth-child(' + left + ')').delay(299).fadeIn(600, 'linear');

            this.sectionsWrap.children().removeAttr('class');
            this.sectionsWrap.children(':nth-child(' + left + ')').addClass('on');
        }
    };

    Slider.init({
        sliderContent: $('.nav-content'),
        sectionsWrap: $('.nav-areas')
    });
})(jQuery);