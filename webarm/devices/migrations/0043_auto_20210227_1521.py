# Generated by Django 3.1.7 on 2021-02-27 13:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0042_auto_20210227_1451'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='baudrate',
            field=models.PositiveIntegerField(choices=[(600, '600'), (19200, '19200'), (300, '300'), (28800, '28800'), (1200, '1200'), (38400, '38400'), (2400, '2400'), (115200, '115200'), (14400, '14400'), (4800, '4800'), (57600, '57600'), (9600, '9600')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('FLOAT', 'FLOAT'), ('BOOL', 'BOOL'), ('WORD', 'WORD'), ('STRING', 'STRING'), ('INT', 'INT'), ('UINT', 'UINT')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('FLOAT', 'FLOAT'), ('STRING', 'STRING'), ('BOOL', 'BOOL'), ('INT', 'INT')], max_length=20, verbose_name='Тип данных'),
        ),
    ]