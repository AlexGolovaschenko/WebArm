# Generated by Django 3.1.1 on 2020-10-12 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0003_auto_20201012_1515'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='device',
            options={'verbose_name': 'Устройство', 'verbose_name_plural': 'Устройства'},
        ),
        migrations.AlterModelOptions(
            name='modbusdeviceparameters',
            options={'verbose_name': 'Параметры устройства модбас', 'verbose_name_plural': 'Параметры устройств модбас'},
        ),
        migrations.AlterModelOptions(
            name='modbustagparameters',
            options={'verbose_name': 'Параметры регистра модбас', 'verbose_name_plural': 'Параметры регистров модбас'},
        ),
        migrations.AlterModelOptions(
            name='tag',
            options={'verbose_name': 'Тег', 'verbose_name_plural': 'Теги'},
        ),
        migrations.AddField(
            model_name='device',
            name='connector_type',
            field=models.CharField(choices=[('KAPITONOV-M1-RS485', 'Модем "Капитонов М1-RS485". Протокол Modbus'), ('OWENCLOUD-GATEWAY', 'OwenCloud API Gateway')], default=1, max_length=20, verbose_name='Тип подключения'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(300, '300'), (19200, '19200'), (2400, '2400'), (38400, '38400'), (600, '600'), (9600, '9600'), (28800, '28800'), (14400, '14400'), (115200, '115200'), (57600, '57600'), (1200, '1200'), (4800, '4800')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='device_address',
            field=models.PositiveSmallIntegerField(verbose_name='Адрес устройства'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='parity',
            field=models.CharField(choices=[('odd', 'odd'), ('even', 'even'), ('none', 'none')], default='none', max_length=4, verbose_name='Контроль четности'),
        ),
    ]
