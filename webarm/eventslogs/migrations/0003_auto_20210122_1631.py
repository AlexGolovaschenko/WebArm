# Generated by Django 3.1.1 on 2021-01-22 14:31

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('eventslogs', '0002_auto_20210122_1627'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='date',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Время и дата записи'),
        ),
    ]