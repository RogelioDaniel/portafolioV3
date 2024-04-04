function showPopupDialog(x, y) {
    const popupDialog = document.getElementById('popup-dialog');
    popupDialog.style.display = 'block';
    popupDialog.style.left = x + 'px';
    popupDialog.style.top = y + 'px';
  }
  
  // Ocultar el cuadro de diálogo al hacer clic en cualquier parte del documento
  document.addEventListener('click', function(event) {
    const popupDialog = document.getElementById('popup-dialog');
    popupDialog.style.display = 'none';
  });
  