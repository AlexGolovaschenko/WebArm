# Generated by Django 3.1.1 on 2021-01-22 15:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0030_auto_20210122_1631'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(600, '600'), (28800, '28800'), (2400, '2400'), (300, '300'), (38400, '38400'), (4800, '4800'), (19200, '19200'), (9600, '9600'), (57600, '57600'), (1200, '1200'), (14400, '14400'), (115200, '115200')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='protocol_type',
            field=models.CharField(choices=[('RTU', 'MODBUS-RTU'), ('ASCII', 'MODBUS-ASCII'), ('TCP', 'MODBUS-TCP')], default='RTU', max_length=5, verbose_name='Протокол'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('UINT', 'UINT'), ('FLOAT', 'FLOAT'), ('INT', 'INT'), ('BOOL', 'BOOL'), ('WORD', 'WORD'), ('STRING', 'STRING')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('BOOL', 'BOOL'), ('INT', 'INT'), ('FLOAT', 'FLOAT'), ('STRING', 'STRING')], max_length=20, verbose_name='Тип данных'),
        ),
    ]