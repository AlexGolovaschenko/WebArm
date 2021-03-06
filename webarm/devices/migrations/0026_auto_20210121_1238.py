# Generated by Django 3.1.1 on 2021-01-21 10:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0025_auto_20210115_1824'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(19200, '19200'), (28800, '28800'), (300, '300'), (4800, '4800'), (115200, '115200'), (57600, '57600'), (9600, '9600'), (600, '600'), (1200, '1200'), (38400, '38400'), (14400, '14400'), (2400, '2400')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='protocol_type',
            field=models.CharField(choices=[('RTU', 'MODBUS-RTU'), ('ASCII', 'MODBUS-ASCII'), ('TCP', 'MODBUS-TCP')], default='RTU', max_length=5, verbose_name='Протокол'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('FLOAT', 'FLOAT'), ('UINT', 'UINT'), ('BOOL', 'BOOL'), ('STRING', 'STRING'), ('WORD', 'WORD'), ('INT', 'INT')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('STRING', 'STRING'), ('FLOAT', 'FLOAT'), ('INT', 'INT'), ('BOOL', 'BOOL')], max_length=20, verbose_name='Тип данных'),
        ),
        migrations.AddIndex(
            model_name='historicalbooleanvalue',
            index=models.Index(fields=['tag', 'add_date'], name='devices_his_tag_id_73febd_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalbooleanvalue',
            index=models.Index(fields=['add_date'], name='devices_his_add_dat_44be72_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalfloatvalue',
            index=models.Index(fields=['tag', 'add_date'], name='devices_his_tag_id_219a97_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalfloatvalue',
            index=models.Index(fields=['add_date'], name='devices_his_add_dat_53b3dc_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalintvalue',
            index=models.Index(fields=['tag', 'add_date'], name='devices_his_tag_id_cfa56e_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalintvalue',
            index=models.Index(fields=['add_date'], name='devices_his_add_dat_df4799_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalstringvalue',
            index=models.Index(fields=['tag', 'add_date'], name='devices_his_tag_id_ad8d6c_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalstringvalue',
            index=models.Index(fields=['add_date'], name='devices_his_add_dat_1386bc_idx'),
        ),
    ]
