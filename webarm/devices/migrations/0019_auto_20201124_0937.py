# Generated by Django 3.1.1 on 2020-11-24 07:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0018_auto_20201123_1746'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(9600, '9600'), (19200, '19200'), (600, '600'), (300, '300'), (4800, '4800'), (14400, '14400'), (1200, '1200'), (28800, '28800'), (38400, '38400'), (2400, '2400'), (57600, '57600'), (115200, '115200')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='parity',
            field=models.CharField(choices=[('even', 'even'), ('none', 'none'), ('odd', 'odd')], default='none', max_length=4, verbose_name='Контроль четности'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='protocol_type',
            field=models.CharField(choices=[('ASCII', 'MODBUS-ASCII'), ('TCP', 'MODBUS-TCP'), ('RTU', 'MODBUS-RTU')], default='RTU', max_length=5, verbose_name='Протокол'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('WORD', 'WORD'), ('FLOAT', 'FLOAT'), ('UINT', 'UINT'), ('BOOL', 'BOOL'), ('STRING', 'STRING'), ('INT', 'INT')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('BOOL', 'BOOL'), ('INT', 'INT'), ('FLOAT', 'FLOAT'), ('STRING', 'STRING')], max_length=20, verbose_name='Тип данных'),
        ),
    ]
