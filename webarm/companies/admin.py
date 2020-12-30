from django.contrib import admin

from .models import Company


class CompanyAdmin(admin.ModelAdmin):
    list_display  = ('name', 'company_owner')

    def company_owner(self, obj):
        return str(obj.owner)
    company_owner.short_description = 'Владелец'


admin.site.register(Company, CompanyAdmin)
