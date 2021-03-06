# Generated by Django 3.1.1 on 2020-11-06 15:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0006_auto_20201105_1843'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='boudrate',
            field=models.PositiveSmallIntegerField(choices=[(9600, '9600'), (28800, '28800'), (115200, '115200'), (57600, '57600'), (600, '600'), (19200, '19200'), (2400, '2400'), (4800, '4800'), (300, '300'), (1200, '1200'), (38400, '38400'), (14400, '14400')], default=9600, verbose_name='Скорость обмена данными'),
        ),
        migrations.AlterField(
            model_name='modbusdeviceparameters',
            name='parity',
            field=models.CharField(choices=[('even', 'even'), ('none', 'none'), ('odd', 'odd')], default='none', max_length=4, verbose_name='Контроль четности'),
        ),
        migrations.AlterField(
            model_name='modbustagparameters',
            name='data_type',
            field=models.CharField(choices=[('WORD', 'WORD'), ('BOOL', 'BOOL'), ('STRING', 'STRING'), ('FLOAT', 'FLOAT'), ('UINT', 'UINT'), ('INT', 'INT')], max_length=50),
        ),
        migrations.AlterField(
            model_name='tag',
            name='data_type',
            field=models.CharField(choices=[('BOOL', 'BOOL'), ('STRING', 'STRING'), ('INT', 'INT'), ('FLOAT', 'FLOAT')], max_length=20, verbose_name='Тип данных'),
        ),
        migrations.CreateModel(
            name='HistoricalStringValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(blank=True, max_length=200, verbose_name='STRING-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('add_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.tag')),
            ],
            options={
                'verbose_name': 'Архивное STRING-значение тега',
                'verbose_name_plural': 'Архивные STRING-значения тега',
            },
        ),
        migrations.CreateModel(
            name='HistoricalIntValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.IntegerField(blank=True, verbose_name='INTEGER-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('add_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.tag')),
            ],
            options={
                'verbose_name': 'Архивное INTEGER-значение тега',
                'verbose_name_plural': 'Архивные INTEGER-значения тега',
            },
        ),
        migrations.CreateModel(
            name='HistoricalFloatValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.FloatField(blank=True, verbose_name='FLOAT-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('add_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.tag')),
            ],
            options={
                'verbose_name': 'Архивное FLOAT-значение тега',
                'verbose_name_plural': 'Архивные FLOAT-значения тега',
            },
        ),
        migrations.CreateModel(
            name='HistoricalBooleanValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.BooleanField(blank=True, verbose_name='BOOLEAN-значение')),
                ('quality', models.CharField(choices=[('GOOD', 'GOOD'), ('BAD', 'BAD')], default='BAD', max_length=4, verbose_name='Качество')),
                ('add_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='devices.tag')),
            ],
            options={
                'verbose_name': 'Архивное BOOLEAN-значение тега',
                'verbose_name_plural': 'Архивные BOOLEAN-значения тега',
            },
        ),
    ]
