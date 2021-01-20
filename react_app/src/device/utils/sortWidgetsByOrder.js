

export default function sortWidgetsByOrder(template) {
    var widgets = template.widgets
    if (!widgets) {return {'widgets':[]}}


    widgets.sort( (a, b) => {
        var KeyA = parseInt(a.order)
        var KeyB = parseInt(b.order)
        if (KeyA < KeyB) return -1;
        if (KeyA > KeyB) return 1;
        return 0;
      });


    return {'widgets':widgets}
}