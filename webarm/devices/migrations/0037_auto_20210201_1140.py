# Generated by Django 3.1.1 on 2021-02-01 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0036_auto_20210201_1136'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(300, '300'), (1200, '1200'), (19200, '19200'), (38400, '38400'), (115200, '115200'), (600, '600'), (57600, '57600'), (14400, '14400'), (4800, '4800'), (9600, '9600'), (2400, '2400'), (28800, '28800')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='parity',
            field=models.CharField(choices=[('even', 'even'), ('none', 'none'), ('odd', 'odd')], default='none', max_length=4, verbose_name='Контроль четности'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='protocol_type',
            field=models.CharField(choices=[('RTU', 'MODBUS-RTU'), ('TCP', 'MODBUS-TCP'), ('ASCII', 'MODBUS-ASCII')], default='RTU', max_length=5, verbose_name='Протокол'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('FLOAT', 'FLOAT'), ('UINT', 'UINT'), ('WORD', 'WORD'), ('BOOL', 'BOOL'), ('STRING', 'STRING'), ('INT', 'INT')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('BOOL', 'BOOL'), ('FLOAT', 'FLOAT'), ('INT', 'INT'), ('STRING', 'STRING')], max_length=20, verbose_name='Тип данных'),
        ),
    ]