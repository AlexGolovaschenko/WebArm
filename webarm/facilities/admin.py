from django.contrib import admin

from .models import Facility

class FacilityAdmin(admin.ModelAdmin):
    list_display  = ('name', 'company_owner', 'company_name')

    def company_owner(self, obj):
        return str(obj.company.owner)
    company_owner.short_description = 'Владелец'

    def company_name(self, obj):
        return str(obj.company.name)
    company_name.short_description = 'Компания'

admin.site.register(Facility, FacilityAdmin)
