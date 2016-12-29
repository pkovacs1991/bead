function ajaxDelete(url) {

  const headers = {
    'csrf-token': $('[name="_csrf"]').val()
  }
  return Promise.resolve(
    $.ajax({
      url: `/ajax${url}`,
      method: 'GET',
      dataType: 'json',
      headers
    })
  )

 
}



function onDeleteClick(e) {
   
  e.preventDefault()
  const url = $(this).attr('href')

  var splittedUrl = url.split("/")
  var loadUrl = "/" +  splittedUrl[1] + "/" +  splittedUrl[3]  

   ajaxDelete(url)
        .then(function(data) {

          $('.app-container').load(loadUrl + ' .app-container', function () {  
           
          })
          
        })
        .catch(function (reason) {
          console.error(reason);
          $('.help-block').text('Hiba történt a feldolgozás során')
        });
}

function ajaxAssign(url) {

  const headers = {
    'csrf-token': $('[name="_csrf"]').val()
  }
  return Promise.resolve(
    $.ajax({
      url: `/ajax${url}`,
      method: 'GET',
      dataType: 'json',
      headers
    })
  )

 
}



function onAssignClick(e) {
   
  e.preventDefault()
  const url = $(this).attr('href')

  var splittedUrl = url.split("/")
  var loadUrl = "/" +  splittedUrl[1] + "/" +  splittedUrl[3]  

   ajaxAssign(url)
        .then(function(data) {

         $('.app-container').load(loadUrl + ' .app-container', function () {  
          
          })  
          
        })
        .catch(function (reason) {
          console.error(reason);
          $('.help-block').text('Hiba történt a feldolgozás során')
        });
}

$('.app-container').on('click','.assign-lecture', onAssignClick)
$('.app-container').on('click', '.drop-lecture', onDeleteClick)

