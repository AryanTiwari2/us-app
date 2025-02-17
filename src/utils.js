import Swal from 'sweetalert2';

export const showAlert = ({type,message}) => {
    let iconType;

    switch (type) {
      case 'success':
        iconType = 'success';
        break;
      case 'error':
        iconType = 'error';
        break;
      case 'warning':
        iconType = 'warning';
        break;
      case 'info':
        iconType = 'info';
        break;
      default:
        iconType = 'info';
    }

    Swal.fire({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      text: message,
      icon: iconType,
      confirmButtonText: 'OK'
    });
  };