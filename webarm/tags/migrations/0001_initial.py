# Generated by Django 4.1 on 2022-08-10 06:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('devices', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=40, verbose_name='Код')),
                ('name', models.CharField(max_length=100, verbose_name='Наименование')),
                ('data_type', models.CharField(choices=[('INT', 'INT'), ('FLOAT', 'FLOAT'), ('STRING', 'STRING'), ('BOOL', 'BOOL')], max_length=20, verbose_name='Тип данных')),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='devices.device', verbose_name='Устройство')),
            ],
            options={
                'verbose_name': 'Тег',
                'verbose_name_plural': 'Теги',
                'unique_together': {('code', 'device')},
            },
        ),
        migrations.CreateModel(
            name='ModbusTagParameters',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('register_address', models.PositiveSmallIntegerField()),
                ('read_function', models.CharField(choices=[('1', '1 - Read Coil'), ('2', '2 - Read Discrete Input'), ('3', '3 - Read Holding Registers'), ('4', '4 - Read Input Registers')], default='4', max_length=2)),
                ('write_function', models.CharField(choices=[('5', '5 - Write Single Coil'), ('6', '6 - Write Single Holding Register'), ('15', '15 - Write Multiple Coils'), ('16', '16 - Write Multiple Holding Registers')], default='16', max_length=2)),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='tags.tag')),
            ],
            options={
                'verbose_name': 'Параметры протокола Modbus',
                'verbose_name_plural': 'Параметры протокола Modbus',
            },
        ),
        migrations.CreateModel(
            name='HistoricalStringValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(blank=True, max_length=200, verbose_name='STRING-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('add_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tags.tag')),
            ],
            options={
                'verbose_name': 'Архивное STRING-значение тега',
                'verbose_name_plural': 'Архивные STRING-значения тега',
            },
        ),
        migrations.CreateModel(
            name='HistoricalIntValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.IntegerField(blank=True, verbose_name='INTEGER-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('add_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tags.tag')),
            ],
            options={
                'verbose_name': 'Архивное INTEGER-значение тега',
                'verbose_name_plural': 'Архивные INTEGER-значения тега',
            },
        ),
        migrations.CreateModel(
            name='HistoricalFloatValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.FloatField(blank=True, verbose_name='FLOAT-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('add_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tags.tag')),
            ],
            options={
                'verbose_name': 'Архивное FLOAT-значение тега',
                'verbose_name_plural': 'Архивные FLOAT-значения тега',
            },
        ),
        migrations.CreateModel(
            name='HistoricalBooleanValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.BooleanField(blank=True, verbose_name='BOOLEAN-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('add_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tags.tag')),
            ],
            options={
                'verbose_name': 'Архивное BOOLEAN-значение тега',
                'verbose_name_plural': 'Архивные BOOLEAN-значения тега',
            },
        ),
        migrations.CreateModel(
            name='CurrentStringValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(blank=True, max_length=200, verbose_name='STRING-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='tags.tag')),
            ],
            options={
                'verbose_name': 'Текущее STRING-значение тега',
                'verbose_name_plural': 'Текущие STRING-значения тега',
            },
        ),
        migrations.CreateModel(
            name='CurrentIntValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.IntegerField(blank=True, verbose_name='INTEGER-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='tags.tag')),
            ],
            options={
                'verbose_name': 'Текущее INTEGER-значение тега',
                'verbose_name_plural': 'Текущие INTEGER-значения тега',
            },
        ),
        migrations.CreateModel(
            name='CurrentFloatValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.FloatField(blank=True, verbose_name='FLOAT-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='tags.tag')),
            ],
            options={
                'verbose_name': 'Текущее FLOAT-значение тега',
                'verbose_name_plural': 'Текущие FLOAT-значения тега',
            },
        ),
        migrations.CreateModel(
            name='CurrentBooleanValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.BooleanField(blank=True, verbose_name='BOOLEAN-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='tags.tag')),
            ],
            options={
                'verbose_name': 'Текущее BOOLEAN-значение тега',
                'verbose_name_plural': 'Текущие BOOLEAN-значения тега',
            },
        ),
        migrations.AddIndex(
            model_name='historicalstringvalue',
            index=models.Index(fields=['tag', 'add_date'], name='tags_histor_tag_id_949859_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalstringvalue',
            index=models.Index(fields=['add_date'], name='tags_histor_add_dat_dab10c_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalintvalue',
            index=models.Index(fields=['tag', 'add_date'], name='tags_histor_tag_id_f5ccf1_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalintvalue',
            index=models.Index(fields=['add_date'], name='tags_histor_add_dat_cac705_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalfloatvalue',
            index=models.Index(fields=['tag', 'add_date'], name='tags_histor_tag_id_5c224d_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalfloatvalue',
            index=models.Index(fields=['add_date'], name='tags_histor_add_dat_64f360_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalbooleanvalue',
            index=models.Index(fields=['tag', 'add_date'], name='tags_histor_tag_id_09756e_idx'),
        ),
        migrations.AddIndex(
            model_name='historicalbooleanvalue',
            index=models.Index(fields=['add_date'], name='tags_histor_add_dat_c05c95_idx'),
        ),
    ]