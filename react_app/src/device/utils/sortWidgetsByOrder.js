

export default function sortWidgetsByOrder(template) {
    var widgets = template.widgets
    if (!widgets) {return {'widgets':[]}}

    widgets.sort( (a, b) => {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
      });


    return {'widgets':widgets}
}