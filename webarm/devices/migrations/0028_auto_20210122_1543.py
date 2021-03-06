# Generated by Django 3.1.1 on 2021-01-22 13:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0027_auto_20210122_1540'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(4800, '4800'), (28800, '28800'), (9600, '9600'), (115200, '115200'), (19200, '19200'), (300, '300'), (57600, '57600'), (600, '600'), (38400, '38400'), (1200, '1200'), (2400, '2400'), (14400, '14400')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='parity',
            field=models.CharField(choices=[('even', 'even'), ('odd', 'odd'), ('none', 'none')], default='none', max_length=4, verbose_name='Контроль четности'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='protocol_type',
            field=models.CharField(choices=[('TCP', 'MODBUS-TCP'), ('RTU', 'MODBUS-RTU'), ('ASCII', 'MODBUS-ASCII')], default='RTU', max_length=5, verbose_name='Протокол'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('FLOAT', 'FLOAT'), ('WORD', 'WORD'), ('INT', 'INT'), ('UINT', 'UINT'), ('BOOL', 'BOOL'), ('STRING', 'STRING')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('BOOL', 'BOOL'), ('INT', 'INT'), ('FLOAT', 'FLOAT'), ('STRING', 'STRING')], max_length=20, verbose_name='Тип данных'),
        ),
    ]
