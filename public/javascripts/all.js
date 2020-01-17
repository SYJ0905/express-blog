(function init($) {
  $('.deletePost').on('click', (e) => {
    e.preventDefault();
    const id = $(e.target).data('id');
    const title = $(e.target).data('title');
    if (window.confirm(`確認是否刪除${title}`)) {
      $.ajax({
        method: 'POST',
        url: `/dashboard/article/delete/${id}`,
      }).done((response) => {
        console.log(response);
        window.location = '/dashboard/archives';
      });
    }
  });
// eslint-disable-next-line no-undef
}(jQuery));
