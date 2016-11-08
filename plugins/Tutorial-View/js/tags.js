var parent;
var tobreak = false;

function findElement(source_element, element)
{
  $(source_element).children().each(function(i, value){

    if($(this).is($(element))) {

      tobreak=true;
    }
    if(!tobreak)
    switch (this.tagName) {
      case "h3":
      case "H3":
      parent=this;
      break;
      case "h2":
      case "H2":
      parent=this;
      break;
      case "h1":
      case "H1":
      parent=this;
      break;
      default:
      findElement(this, element, parent, tobreak);
    }


  });
}

// Create a new object based of the HTMLElement prototype
var highlightcodeProto = Object.create(HTMLElement.prototype);

// Set up the element.
highlightcodeProto.createdCallback = function() {
  // Create a Shadow Root
  var shadow = this.createShadowRoot();
  var _this =this;
  // Create a standard img element and set it's attributes.
  var span = document.createElement('span');
  span.innerHTML=this.innerHTML;
  span.style.textDecoration = "underline";

  // Add the image to the Shadow Root.
  shadow.appendChild(span);
  var code=this.getAttribute('code');
  var colorvalue=this.getAttribute('color');
  var fromline=this.getAttribute('from');
  var toline=this.getAttribute('to');
  // Add an event listener to the image.
  span.addEventListener('click', function(e) {

    codiad.tutorial.highlightCode(code,fromline,toline,colorvalue);
    codiad.tutorial.openEditor();
    setTimeout(function(){
      parent="";
      tobreak=false;
      findElement($(".tutorial"), _this, parent, tobreak);


      //MOVE TOC
      var container = $('#toc'),
      scrollTo = $("#"+parent.getAttribute('tocid'));

      $("#toc ul").children().each(function(i, value){$(this).removeClass("toc-active");});
      $("#"+parent.getAttribute('tocid')).addClass("toc-active");
      $("#toc").animate({
        scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()

      }, 200);
      //MOVE FILE manager search li with code
      var lielementcode;
      var container = $('#file-manager');
      container.find("li").each(function(i, value){

        if($(this).find("a").attr("data-path") == code) lielementcode=this;

      });

      var scrollTo = $(lielementcode);
      if(scrollTo != null)
      $("#file-manager").animate({
        scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()

      }, 200);

    }, 100);

  });
  span.style.color = "blue";
  span.addEventListener('mouseenter', function(e) {
    span.style.color = "red";
  });
  span.addEventListener('mouseleave', function(e) {

    span.style.color = "blue";
  });

};
try {
  var highlightcode = document.registerElement('highlight-code', {
    prototype: highlightcodeProto
  });

} catch(e) {
  //  console.log('already exists', e);
}
// Register the new element.

// Create a new object based of the HTMLElement prototype
var opencodeProto = Object.create(HTMLElement.prototype);


// Set up the element.
opencodeProto.createdCallback = function() {
  // Create a Shadow Root
  var shadow = this.createShadowRoot();
  var _this=this;

  // Create a standard img element and set it's attributes.
  var span = document.createElement('span');
  span.innerHTML=this.innerHTML;
  span.style.textDecoration = "underline";

  // Add the image to the Shadow Root.
  shadow.appendChild(span);
  var code=this.getAttribute('code');
  // Add an event listener to the image.
  span.addEventListener('click', function(e) {
    codiad.filemanager.openFile(code,true);
    codiad.filemanager.index(code.substring(0,code.lastIndexOf("/")),true);
  codiad.tutorial.openEditor();
    setTimeout(function(){

      parent="";
      tobreak=false;
      findElement($(".tutorial"), _this, parent, tobreak);

    //  console.log(parent);
      //MOVE TOC
      var container = $('#toc'),
      scrollTo = $("#"+parent.getAttribute('tocid'));
      $("#toc ul").children().each(function(i, value){$(this).removeClass("toc-active");});
      $("#"+parent.getAttribute('tocid')).addClass("toc-active");
      $("#toc").animate({
        scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()

      }, 200);
      //MOVE FILE manager search li with code
      var lielementcode;
      var container = $('#file-manager');
      container.find("li").each(function(i, value){

        if($(this).find("a").attr("data-path") == code) lielementcode=this;

      });

      var scrollTo = $(lielementcode);
      if(scrollTo != null)
      $("#file-manager").animate({
        scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()

      }, 200);

    }, 100);

  });
  span.style.color = "green";
  span.addEventListener('mouseenter', function(e) {

    span.style.color = "red";
  });
  span.addEventListener('mouseleave', function(e) {

    span.style.color = "green";
  });

};
try {
  var opencode = document.registerElement('open-code', {
    prototype: opencodeProto
  });

} catch(e) {
  //  console.log('already exists', e);
}
// Register the new element.


//OPEN_MODAL_TUTORIAL
// Create a new object based of the HTMLElement prototype
var modaltutorialProto = Object.create(HTMLElement.prototype);


// Set up the element.
modaltutorialProto.createdCallback = function() {
  // Create a Shadow Root
  var shadow = this.createShadowRoot();
  var _this=this;

  // Create a standard img element and set it's attributes.
  var span = document.createElement('span');
  span.innerHTML=this.innerHTML;
  span.style.textDecoration = "underline";

  // Add the image to the Shadow Root.
  shadow.appendChild(span);
  var data=this.getAttribute('data');
  var ref=this.getAttribute('ref');
  // Add an event listener to the image.
  span.addEventListener('click', function(e) {

    codiad.modal.load(400, data);
    $('#modal-content').addClass("tutorial");
    $('#modal-content').css("width",$(window).width()/2);
    codiad.tutorial.replaceElementTag('#modal-content open-code', '<span></span>');
    codiad.tutorial.replaceElementTag("#modal-content highlight-code", "<span></span>");
    codiad.tutorial.replaceElementTag("#modal-content modal-data", "<span></span>");
    codiad.modal.hideOverlay();


  });
  span.style.color = "yellow";
  span.addEventListener('mouseenter', function(e) {

    span.style.color = "red";
  });
  span.addEventListener('mouseleave', function(e) {

    span.style.color = "yellow";
  });

};
try {
  var modaltutorial = document.registerElement('modal-data', {
    prototype: modaltutorialProto
  });

} catch(e) {
  //  console.log('already exists', e);
}
