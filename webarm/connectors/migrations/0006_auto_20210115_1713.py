# Generated by Django 3.1.1 on 2021-01-15 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('connectors', '0005_auto_20201124_1355'),
    ]

    operations = [
        migrations.AlterField(
            model_name='connector',
            name='connector_type',
            field=models.CharField(choices=[('KAPITONOV-M1-RS485', 'Модем "Капитонов М1-RS485". Протокол Modbus'), ('OWENCLOUD-GATEWAY', 'OwenCloud API Gateway')], max_length=20, verbose_name='Тип подключения'),
        ),
    ]