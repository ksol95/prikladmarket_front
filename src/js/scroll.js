var scrollables = document.getElementsByClassName('scrollable');
scrollables[0].addEventListener('scroll', scrolled);
function scrolled(e) {
  var content = this.getElementsByClassName('content')[0];
  var scrollingRange = content.offsetHeight - this.offsetHeight;
  var scrollingRatio = this.scrollTop / scrollingRange;

  var scrollbar = this.getElementsByClassName('scrollbar')[0];
  var scrollbarRange = this.offsetHeight - scrollbar.offsetHeight;
  scrollbar.style.top = String(scrollingRatio * scrollbarRange) + 'px';
  console.log(scrollingRatio, scrollbarRange);
}
