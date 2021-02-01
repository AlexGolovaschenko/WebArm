from django.contrib import admin
from django.utils.safestring import mark_safe
from django.urls import reverse

from .models import Log, Event, Record


class RecordsInline(admin.TabularInline):
    model = Record
    show_change_link = False
    readonly_fields = ['edit_link', 'date', 'message']
    extra = 0

    def edit_link(self, instance):
        if instance.id:
            url = reverse('admin:eventslogs_record_change', args=(instance.id,))
        else:
            url = reverse('admin:eventslogs_record_add')        
        return mark_safe("<a href='%s'>%s</a>" % (url, instance.__str__()))
    edit_link.short_description = 'Запись'



class LogAdmin(admin.ModelAdmin):
    list_display  = ('__str__', 'device')
    inlines = [RecordsInline]

    class Media:
        css = { "all" : ("css/hide_admin_original.css",) }

class RecordAdmin(admin.ModelAdmin):
    list_display  = ('__str__', 'date', 'log__device', 'log')
    readonly_fields = ['date']
    fields = ['log', 'date', 'message']

    def log__device(self, instance):
        return str(instance.log.device)
    log__device.short_description = 'Устройство'

class EventAdmin(admin.ModelAdmin):
    list_display  = ('__str__', 'device', 'enable', 'categories')



admin.site.register(Log, LogAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Record, RecordAdmin)