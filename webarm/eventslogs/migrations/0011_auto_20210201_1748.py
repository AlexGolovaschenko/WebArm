# Generated by Django 3.1.1 on 2021-02-01 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventslogs', '0010_auto_20210201_1140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='raise_time',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Время возникновения'),
        ),
    ]