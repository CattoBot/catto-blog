class myDate extends Date {
  constructor() {
    super();
  }

  getFormattedDate() {
    var months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','niviembre','diciembre'];
    return this.getDate() + "-" + months[this.getMonth()] + "-" + this.getFullYear();
  }
}