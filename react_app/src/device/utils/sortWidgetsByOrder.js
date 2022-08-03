

export default function sortWidgetsByOrder(template) {
    if (template === null || template.widgets === null) {
      return {'widgets':[]}
    }

    let widgets = template.widgets;
    if (widgets) {
      widgets.sort( (a, b) => {
          var KeyA = parseInt(a.order)
          var KeyB = parseInt(b.order)
          if (KeyA < KeyB) return -1;
          if (KeyA > KeyB) return 1;
          return 0;
        });
    }
    return {'widgets':widgets};
}