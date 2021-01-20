# Generated by Django 3.1.1 on 2021-01-15 15:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0024_auto_20210115_1734'),
        ('widgets', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='widgetstemplate',
            options={'verbose_name': 'Шаблон виджетов', 'verbose_name_plural': 'Шаблоны виджетов'},
        ),
        migrations.AddField(
            model_name='widgetstemplate',
            name='device',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='devices.device', verbose_name='Устройство'),
            preserve_default=False,
        ),
    ]