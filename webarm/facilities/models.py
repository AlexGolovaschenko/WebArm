from django.db import models
# TODO: from django.contrib.gis.db.models import RasterField

from companies.models import Company


class Facility(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, verbose_name='Компания')

    name = models.CharField(max_length=200, verbose_name='Наименование')
    # TODO: geo = RasterField(verbose_name='Положение на карте')



    def __str__(self):
        return f'{self.company.owner.username}: {self.company.name}: {self.name}'

    class Meta():
        verbose_name = 'Объект'
        verbose_name_plural = 'Объекты'    