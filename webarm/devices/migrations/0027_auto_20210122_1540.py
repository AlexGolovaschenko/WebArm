# Generated by Django 3.1.1 on 2021-01-22 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0026_auto_20210121_1238'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(2400, '2400'), (9600, '9600'), (38400, '38400'), (57600, '57600'), (28800, '28800'), (115200, '115200'), (300, '300'), (4800, '4800'), (19200, '19200'), (1200, '1200'), (14400, '14400'), (600, '600')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='parity',
            field=models.CharField(choices=[('even', 'even'), ('none', 'none'), ('odd', 'odd')], default='none', max_length=4, verbose_name='Контроль четности'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='protocol_type',
            field=models.CharField(choices=[('ASCII', 'MODBUS-ASCII'), ('RTU', 'MODBUS-RTU'), ('TCP', 'MODBUS-TCP')], default='RTU', max_length=5, verbose_name='Протокол'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('FLOAT', 'FLOAT'), ('STRING', 'STRING'), ('BOOL', 'BOOL'), ('WORD', 'WORD'), ('UINT', 'UINT'), ('INT', 'INT')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('BOOL', 'BOOL'), ('FLOAT', 'FLOAT'), ('STRING', 'STRING'), ('INT', 'INT')], max_length=20, verbose_name='Тип данных'),
        ),
    ]
