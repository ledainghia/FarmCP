import Swal from 'sweetalert2';

export const swalMixin = Swal.mixin({
  customClass: {
    confirmButton:
      'border-none bg-primary text-primary-foreground hover:bg-primary/90  hover:ring-primary  h-11 md:px-6  px-4  ',
    cancelButton:
      'border-none bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:ring-destructive h-11 md:px-6  px-4 ',
    actions: 'flex justify-center gap-2',
    title: 'text-lg',
    htmlContainer: 'text-lg',
  },
  confirmButtonText: 'Đồng ý',
  denyButtonText: 'Hủy bỏ',
  buttonsStyling: false,
});
