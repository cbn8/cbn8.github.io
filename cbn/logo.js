/*
**
** A pen by Alex Buffet
** https://alexandrebuffet.fr
**
** Inspired by 
**
**
*/

;(function ( $ ) {
    //Make your content a heroe
    $.fn.transformHeroes = function() {
        //Variables
        var perspective = '100px',
        delta = 20,
        width = this.width(),
        height = this.height(),
        midWidth = width / 2,
        midHeight = height / 2;
        //Events
        this.on({
            mousemove: function(e) {
                var pos = $(this).offset(),
                cursPosX = e.pageX - pos.left,
                cursPosY = e.pageY - pos.top,
                cursCenterX = midWidth - cursPosX,
                cursCenterY = midHeight - cursPosY;
  
                $(this).css('transform','perspective(' + perspective + ') rotateX('+ (cursCenterY / delta) +'deg) rotateY('+ -(cursCenterX / delta) +'deg)');
                $(this).removeClass('is-out');
            },
            mouseleave: function() {
                $(this).addClass('is-out');
            }
        });
        //Return
        return this;
    };
  }( jQuery ));
  
  //Set plugin on cards
  $('.super-navbar__logo-image').transformHeroes();