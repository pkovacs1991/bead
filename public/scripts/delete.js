function ajaxDelete(url) {
  const headers = {
    'csrf-token': $('[name="_csrf"]').val()
  }
  return Promise.resolve(
    $.ajax({
      url: `/ajax${url}`,
      method: 'DELETE',
      dataType: 'json',
      headers
    })
  )
}

class ConfirmModal {
  constructor(selector) {
    this._modal = $(selector)
    this._ok = this._modal.find('.modal-ok')
    this._cancel = this._modal.find('.modal-cancel')
    this._promise = new Promise(function (resolve, reject) {
      this._resolve = resolve
      this._reject = reject
    }.bind(this))

    this._ok.on('click', e => this.onOk())
    this._cancel.on('click', e => this.onCancel())
  }

  confirm(str) {
    this._modal.modal('show')
    return this._promise
  }

  onOk() {
    this._modal.modal('hide')
    this._resolve(true)
  }

  onCancel() {
    this._modal.modal('hide')
    this._resolve(false)
  }
}

function my_confirm(str) {
  // return Promise.resolve(confirm(str))

  const confirmModal = new ConfirmModal('.confirm-modal')
  return confirmModal.confirm(str)
}

function onDeleteClick(e) {
  // console.log('delete')
  co(function* () {
    e.preventDefault()
    const response = yield my_confirm('Biztos törölni akarod?')
    if (response) {
      const url = $(this).attr('href')
      $('.help-block').text('')
      ajaxDelete(url)
        .then(function(data) {
          console.log(data)
          location.assign('/recipe')
        })
        .catch(function (reason) {
          console.error(reason);
          $('.help-block').text('Hiba történt a feldolgozás során')
        });
    }
  }.bind(this))
}

$('.btn-delete').on('click', onDeleteClick)

