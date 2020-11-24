from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Company(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Владелец')

    name = models.CharField(max_length=200, verbose_name='Наименование')


    def __str__(self):
        return f'{self.owner.username}: {self.name}'

    class Meta():
        verbose_name = 'Компания'
        verbose_name_plural = 'Компании'    