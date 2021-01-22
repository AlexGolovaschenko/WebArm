# Generated by Django 3.1.1 on 2021-01-22 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('connectors', '0008_auto_20210121_1238'),
    ]

    operations = [
        migrations.AlterField(
            model_name='connector',
            name='connector_type',
            field=models.CharField(choices=[('OWENCLOUD-GATEWAY', 'OwenCloud API Gateway'), ('KAPITONOV-M1-RS485', 'Модем "Капитонов М1-RS485". Протокол Modbus')], max_length=20, verbose_name='Тип подключения'),
        ),
    ]
