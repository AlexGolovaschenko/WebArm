# Generated by Django 3.1.1 on 2020-12-12 10:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0020_auto_20201124_1355'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='last_update',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Время последнего обновления данных'),
        ),
        migrations.AlterField(
            model_name='device',
            name='polling_period',
            field=models.PositiveSmallIntegerField(default=30, verbose_name='Период опроса устройства, сек'),
        ),
        migrations.AlterField(
            model_name='device',
            name='timeout',
            field=models.PositiveSmallIntegerField(default=600, verbose_name='Таймайут потери связи с устройством, сек'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(2400, '2400'), (1200, '1200'), (38400, '38400'), (19200, '19200'), (300, '300'), (14400, '14400'), (115200, '115200'), (28800, '28800'), (57600, '57600'), (600, '600'), (9600, '9600'), (4800, '4800')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='parity',
            field=models.CharField(choices=[('odd', 'odd'), ('none', 'none'), ('even', 'even')], default='none', max_length=4, verbose_name='Контроль четности'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='protocol_type',
            field=models.CharField(choices=[('TCP', 'MODBUS-TCP'), ('ASCII', 'MODBUS-ASCII'), ('RTU', 'MODBUS-RTU')], default='RTU', max_length=5, verbose_name='Протокол'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('INT', 'INT'), ('WORD', 'WORD'), ('BOOL', 'BOOL'), ('FLOAT', 'FLOAT'), ('STRING', 'STRING'), ('UINT', 'UINT')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('STRING', 'STRING'), ('BOOL', 'BOOL'), ('FLOAT', 'FLOAT'), ('INT', 'INT')], max_length=20, verbose_name='Тип данных'),
        ),
    ]
