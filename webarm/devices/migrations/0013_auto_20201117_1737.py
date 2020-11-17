# Generated by Django 3.1.1 on 2020-11-17 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0012_auto_20201117_1622'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='display_on_graph_by_default',
            field=models.BooleanField(default=False, verbose_name='Отображать на историческом графике (значение по умолчанию)'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(4800, '4800'), (300, '300'), (38400, '38400'), (57600, '57600'), (600, '600'), (19200, '19200'), (28800, '28800'), (115200, '115200'), (2400, '2400'), (14400, '14400'), (9600, '9600'), (1200, '1200')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='protocol_type',
            field=models.CharField(choices=[('TCP', 'MODBUS-TCP'), ('RTU', 'MODBUS-RTU'), ('ASCII', 'MODBUS-ASCII')], default='RTU', max_length=5, verbose_name='Протокол'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('UINT', 'UINT'), ('BOOL', 'BOOL'), ('WORD', 'WORD'), ('INT', 'INT'), ('FLOAT', 'FLOAT'), ('STRING', 'STRING')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('STRING', 'STRING'), ('BOOL', 'BOOL'), ('INT', 'INT'), ('FLOAT', 'FLOAT')], max_length=20, verbose_name='Тип данных'),
        ),
    ]
